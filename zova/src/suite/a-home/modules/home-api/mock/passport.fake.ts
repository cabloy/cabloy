import { defineFakeRoute } from 'vite-plugin-fake-server-turbo/client';

const __users = [{ name: 'admin', password: '123456', avatar: ':emoji:flower' }];

const __sdkSchemaPassportLogin = {
  doc: {
    openapi: '3.1.0',
    info: {
      version: '5.0.0',
      title: 'Vona',
      description: 'Vona API',
    },
    components: {
      schemas: {
        'home-user.dto.passportJwt': {
          type: 'object',
          properties: {
            passport: {
              $ref: '#/components/schemas/home-user.dto.passport',
            },
            jwt: {
              $ref: '#/components/schemas/a-jwt.dto.jwtToken',
            },
          },
          required: ['passport', 'jwt'],
        },
        'home-user.dto.passport': {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/home-user.entity.user',
            },
            auth: {
              $ref: '#/components/schemas/a-auth.dto.auth',
            },
            roles: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/home-user.entity.role',
              },
            },
          },
          required: ['user', 'auth', 'roles'],
        },
        'home-user.entity.user': {
          type: 'object',
          properties: {
            createdAt: {
              type: 'string',
              format: 'date',
              rest: {
                render: 'date',
                filter: {
                  render: 'dateRange',
                },
                order: 99998,
              },
              title: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date',
              rest: {
                render: 'date',
                filter: {
                  render: 'dateRange',
                },
                order: 99999,
              },
              title: '修改时间',
            },
            deleted: {
              type: 'boolean',
              default: false,
              rest: {
                visible: false,
              },
              title: '已删除',
            },
            iid: {
              type: 'number',
              default: 0,
              rest: {
                visible: false,
              },
              title: '实例标识',
            },
            id: {
              anyOf: [
                {
                  type: 'number',
                },
                {
                  type: 'string',
                },
              ],
              title: '标识',
              rest: {
                order: 101,
              },
            },
            name: {
              type: 'string',
              title: '用户名',
            },
            avatar: {
              type: ['string', 'null'],
              title: '头像',
            },
            email: {
              type: ['string', 'null'],
              title: '电子邮件',
            },
            mobile: {
              type: ['string', 'null'],
              title: '手机号',
            },
            activated: {
              type: 'boolean',
              default: false,
              title: '已激活',
            },
            locale: {
              type: ['string', 'null'],
              title: '语言',
            },
            tz: {
              type: ['string', 'null'],
              title: '时区',
            },
          },
          required: ['createdAt', 'updatedAt', 'id', 'name'],
          title: '用户',
        },
        'a-auth.dto.auth': {
          type: 'object',
          properties: {
            id: {
              anyOf: [
                {
                  type: 'number',
                },
                {
                  type: 'string',
                },
              ],
              title: '标识',
              rest: {
                order: 101,
              },
            },
            profileId: {
              type: 'string',
            },
            authProvider: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  title: '标识',
                  rest: {
                    order: 101,
                  },
                },
                providerName: {
                  type: 'string',
                },
                clientName: {
                  type: 'string',
                },
              },
              required: ['id', 'providerName', 'clientName'],
            },
          },
          required: ['id', 'profileId'],
        },
        'home-user.entity.role': {
          type: 'object',
          properties: {
            createdAt: {
              type: 'string',
              format: 'date',
              rest: {
                render: 'date',
                filter: {
                  render: 'dateRange',
                },
                order: 99998,
              },
              title: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date',
              rest: {
                render: 'date',
                filter: {
                  render: 'dateRange',
                },
                order: 99999,
              },
              title: '修改时间',
            },
            deleted: {
              type: 'boolean',
              default: false,
              rest: {
                visible: false,
              },
              title: '已删除',
            },
            iid: {
              type: 'number',
              default: 0,
              rest: {
                visible: false,
              },
              title: '实例标识',
            },
            id: {
              anyOf: [
                {
                  type: 'number',
                },
                {
                  type: 'string',
                },
              ],
              title: '标识',
              rest: {
                order: 101,
              },
            },
            name: {
              type: 'string',
              title: '角色名',
            },
          },
          required: ['createdAt', 'updatedAt', 'id', 'name'],
          title: '角色',
        },
        'a-jwt.dto.jwtToken': {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
            },
            refreshToken: {
              type: 'string',
            },
            expiresIn: {
              type: 'number',
            },
          },
          required: ['accessToken', 'refreshToken', 'expiresIn'],
        },
        'home-user.dto.login': {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              errorMessage: {
                default: '必填项',
              },
            },
            password: {
              type: 'string',
              minLength: 6,
              errorMessage: {
                default: '必填项',
              },
            },
            captcha: {
              $ref: '#/components/schemas/a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b',
            },
          },
          required: ['username', 'password', 'captcha'],
        },
        'a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b':
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                errorMessage: {
                  default: '必填项',
                },
              },
              token: {
                type: 'string',
                errorMessage: {
                  default: '必填项',
                },
              },
            },
            required: ['id', 'token'],
            rest: {
              render: 'captcha',
              iconPrefix: ':editor:code-block',
            },
          },
      },
      parameters: {},
    },
    paths: {
      '/api/home/user/passport/login': {
        post: {
          tags: ['HomeUserPassport'],
          operationId: 'HomeUserPassport_login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/home-user.dto.login',
                },
              },
            },
          },
          responses: {
            200: {
              description: '',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                      data: {
                        $ref: '#/components/schemas/home-user.dto.passportJwt',
                      },
                    },
                    required: ['code', 'message', 'data'],
                  },
                },
              },
            },
          },
        },
      },
    },
    webhooks: {},
  },
};

export default defineFakeRoute([
  {
    url: '/home/user/passport/login',
    method: 'post',
    response: req => {
      // headers
      const headers = req?.headers;
      if (headers['x-vona-openapi-schema']) {
        return {
          code: 0,
          message: 'Success',
          data: __sdkSchemaPassportLogin,
        };
      }
      // captcha
      const captcha = req.body.captcha;
      if (captcha.id !== '88b3ad2d-e2a9-44bf-9154-3086ef9770a4' || captcha.token !== '7') {
        return {
          code: 422,
          message:
            '[\n  {\n    "code": "custom",\n    "path": [\n      "captcha"\n    ],\n    "message": "验证码不正确"\n  }\n]',
          stack:
            'Error: [\n  {\n    "code": "custom",\n    "path": [\n      "captcha"\n    ],\n    "message": "验证码不正确"\n  }\n]\n',
          name: 'Error',
          level: 'error',
        };
      }
      // user
      const user = __users.find(item => item.name === req.body.username);
      if (!user) {
        return { code: 403, message: 'Error' };
      }
      return {
        code: 0,
        message: 'Success',
        data: {
          passport: {
            user: {
              name: user.name,
              avatar: user.avatar,
            },
            auth: {
              id: 1,
            },
          },
          jwt: {
            accessToken: `accessToken-${user.name}`,
            refreshToken: `refreshToken-${user.name}`,
            expiresIn: 2 * 3600,
          },
        },
      };
    },
  },
  {
    url: '/home/user/passport/current',
    method: 'get',
    response: req => {
      const name = getNameFromAuthorizationHeader(req);
      const user = __users.find(item => item.name === name);
      if (!user) {
        return { code: 401, message: 'Error' };
      }
      return {
        code: 0,
        message: 'Success',
        data: {
          user: {
            name: user.name,
            avatar: user.avatar,
          },
          auth: {
            id: 1,
          },
        },
      };
    },
  },
  {
    url: '/home/user/passport/logout',
    method: 'post',
    response: req => {
      const name = getNameFromAuthorizationHeader(req);
      const user = __users.find(item => item.name === name);
      if (!user) {
        return { code: 403, message: 'Error' };
      }
      return {
        code: 0,
        message: 'Success',
      };
    },
  },
  {
    url: '/home/user/passport/refreshAuthToken',
    method: 'post',
    response: req => {
      const name = req.body.refreshToken.substring('refreshToken-'.length);
      const user = __users.find(item => item.name === name);
      if (!user) {
        return { code: 401, message: 'Error' };
      }
      return {
        code: 0,
        message: 'Success',
        data: {
          accessToken: `accessToken-${user.name}`,
          refreshToken: `refreshToken-${user.name}`,
          expiresIn: 2 * 3600,
        },
      };
    },
  },
]);

function getNameFromAuthorizationHeader(req: any): string | undefined {
  if (!req.headers.authorization) return undefined;
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return undefined;
  return token.substring('accessToken-'.length);
}
