# Upload文件上传

VonaJS 基于[busboy](https://github.com/mscdex/busboy)实现了文件上传的能力。

## 单文件上传

```typescript
class ControllerStudent {
  @Web.post('file')
  @Core.fileUpload()
  @Api.contentType('application/json')
  async uploadFile(@Arg.file('file1', v.title('Upload Single File')) file1: IUploadFile) {
    console.log(file1);
    return file1.file;
  }
}
```

- `@Core.fileUpload`: 此装饰器用于启用 Upload 拦截器。该拦截器解析上传文件，并存入临时文件。在完成业务逻辑之后，该拦截器将自动清理临时文件
- `@Api.contentType`: 如果 API 要返回 JSON 数据，最好明确指定`application/json`。因为有的客户端在发送 API 请求时，可能没有提供明确的 ContentType
- `@Arg.file`: 此装饰器用于标注参数`file1`，从上传的数据中取得`name=file1`的文件

### IUploadFile

| 名称          | 说明         |
| ------------- | ------------ |
| name          | 文件字段名   |
| file          | 临时文件路径 |
| info.filename | 文件名       |
| info.encoding | 文件编码     |
| info.mimeType | 文件类型     |

如下图所示：

![](../../../assets/img/upload/upload-1.png)

## 多文件上传

```typescript
class ControllerStudent {
  @Web.post('files')
  @Core.fileUpload()
  @Api.contentType('application/json')
  async uploadFiles(@Arg.files('files', v.title('Upload Multiple Files')) files: IUploadFile[]) {
    console.log(files);
    return files.map(item => item.file);
  }
}
```

- `@Arg.files`: 此装饰器用于标注参数`files`，从上传的数据中取得`name=files`的文件

## 表单字段

在上传文件的同时，也可以附加多个表单字段。

对于数组类型的字段，前端在构造上传数据时，采用的方式不同，就需要使用不同的参数装饰器。

### 1. @Arg.field

- 前端

```typescript
const formData = new FormData();
formData.append('name', 'vona');
formData.append('tags', ['node', 'typescript']);
```

- API

```diff
export class ControllerStudent extends BeanBase {
  @Web.post('file')
  @Core.fileUpload()
  @Api.contentType('application/json')
  async uploadFile(
+   @Arg.field('name', v.title('Name')) name: string,
+   @Arg.field('tags', v.title('Tags'), v.array(z.string())) tags: string[],
    @Arg.file('file1', v.title('Upload Single File')) file1: IUploadFile,
  ) {
    console.log(name, tags);
    console.log(file1);
    return file1.file;
  }
}
```

- `@Arg.field`: 此装饰器用于标注参数`name/tags`，从上传的数据中取得`name=name/tags`的字段值

### 2. @Arg.fields

- 前端

```typescript
const formData = new FormData();
formData.append('name', 'vona');
formData.append('tags', 'node');
formData.append('tags', 'typescript');
```

- API

```diff
export class ControllerStudent extends BeanBase {
  @Web.post('file')
  @Core.fileUpload()
  @Api.contentType('application/json')
  async uploadFile(
+   @Arg.field('name', v.title('Name')) name: string,
+   @Arg.fields('tags', v.title('Tags'), v.array(z.string())) tags: string[],
    @Arg.file('file1', v.title('Upload Single File')) file1: IUploadFile,
  ) {
    console.log(name, tags);
    console.log(file1);
    return file1.file;
  }
}
```

- `@Arg.fields`: 此装饰器用于标注参数`tags`，从上传的数据中取得`name=tags`的字段值
