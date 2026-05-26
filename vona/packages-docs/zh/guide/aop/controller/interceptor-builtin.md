# 内置拦截器

## 局部拦截器

| 名称                       | 说明                                        |
| -------------------------- | ------------------------------------------- |
| a-captcha:captchaVerify    | 判断验证码是否正确                          |
| a-serialization:serializer | 对Response body进行转换等操作，比如脱敏处理 |
| a-upload:upload            | 对上传文件进行处理                          |

## 全局拦截器

| 名称                        | 说明                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| a-datasharding:datasharding | 用于读写分离，缓存写数据源，确保数据一致性。参见: [读写分离](../../../../cabloy/sharding.md) |
| a-body:bodyReq              | 解析Request body                                                                             |
| a-body:bodyRes              | 封装Response body，提供`code/message/data`等字段                                             |

## a-body:bodyReq

### 为什么使用拦截器解析Request body，而不用中间件呢？

因为拦截器在守卫之后执行，所以可以先判断是否有权限。权限判断通过之后，才解析 Request body，从而提升系统性能。

### 如果在执行拦截器之前需要访问Request body，怎么办？

可以自行解析 Request body，代码如下：

```typescript
// parse
await this.bean.bodyReq.parse();
```

- `bean.bodyReq`: 从全局容器中取得`bodyReq`示例
- `parse`: 解析 Request body。只需解析一次，后续的拦截器将不再解析
