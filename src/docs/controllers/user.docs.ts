export default {
  auth: {
    summary: 'User authentication',
    parameters: [
      {
        in: 'query',
        name: 'username',
        required: 'true',
        type: 'string',
        description: 'username'
      },
      {
        in: 'query',
        name: 'password',
        required: 'true',
        type: 'string',
        format: 'password',
        description: 'password'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  'type': 'string'
                },
                refreshToken: {
                  id: {
                    type: 'number'
                  },
                  uuid: {
                    type: 'string'
                  },
                  expiresIn: {
                    type: 'string'
                  },
                  user_id: {
                    type: 'number'
                  }
                }
              },
              example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0ODkwIiwibmFtZSI6IkpvZ2ZnZmhuIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.GARIyo2w6ZcuniX26kpmMgCmBTp5TX_6tjm2tFMkbRU',
                refreshToken: {
                  id: 12,
                  uuid: '84a18578-efe1-4741-a413-b4a03abaedfb',
                  expiresIn: '1634244248033',
                  user_id: 56
                }
              }
            }
          }
        }
      },
      '412': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing arguments'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user not found'
              }
            }
          }
        }
      },
      '401': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'incorrect password'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  refreshToken: {
    summary: 'Renew refresh token',
    parameters: [
      {
        in: 'query',
        name: 'uuid',
        required: 'true',
        type: 'string',
        format: 'uuid',
        description: 'id'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  'type': 'string'
                },
                refreshToken: {
                  id: {
                    type: 'number'
                  },
                  uuid: {
                    type: 'string'
                  },
                  expiresIn: {
                    type: 'string'
                  },
                  user_id: {
                    type: 'number'
                  }
                }
              },
              example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0ODkwIiwibmFtZSI6IkpvZ2ZnZmhuIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.GARIyo2w6ZcuniX26kpmMgCmBTp5TX_6tjm2tFMkbRU',
                refreshToken: {
                  id: 12,
                  uuid: '84a18578-efe1-4741-a413-b4a03abaedfb',
                  expiresIn: '1634244248033',
                  user_id: 56
                }
              }
            }
          }
        }
      },
      '412': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing arguments'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'refresh token not found'
              }
            }
          }
        }
      },
      '401': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'refresh token expired'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  forgotPassword: {
    summary: 'Request a link to reset the password',
    parameters: [
      {
        in: 'query',
        name: 'username',
        required: 'true',
        type: 'string',
        description: 'the user id'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'recovery email sent'
              }
            }
          }
        }
      },
      '412': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing arguments'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'refresh token not found'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  resetPassword: {
    summary: 'Reset the password',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            },
            example: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0ODkwIiwibmFtZSI6IkpvZ2ZnZmhuIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.GARIyo2w6ZcuniX26kpmMgCmBTp5TX_6tjm2tFMkbRU',
              password: '123456'
            }
          }
        }
      }
    },
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'password changed'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user not found'
              }
            }
          }
        }
      },
      '401 (Missing token)': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing token'
              }
            }
          }
        }
      }
    }
  },
  firstUser: {
    summary: 'Create the first user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              access_level: {
                type: 'string'
              },
              username: {
                type: 'string'
              },
              hashed_password: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              company: {
                name: {
                  type: 'string'
                },
                trade_name: {
                  type: 'string'
                },
                cnpj: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                }
              },
              person: {
                name: {
                  type: 'string'
                },
                cpf: {
                  type: 'string'
                },
                birth: {
                  type: 'string'
                }
              }
            },
            example: {
              access_level: 'client',
              username: 'username',
              hashed_password: 'passwordExample',
              email: 'user@provider.com',
              phone: '91999999999',
              company: {
                name: 'Company name',
                trade_name: 'Company trade name',
                cnpj: '00000000000000',
                description: 'Description company'
              },
              person: {
                name: 'Person name',
                cpf: '00000000000',
                birth: '12121990'
              }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user created'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  create: {
    summary: 'Create user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              access_level: {
                type: 'string'
              },
              username: {
                type: 'string'
              },
              hashed_password: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              company: {
                name: {
                  type: 'string'
                },
                trade_name: {
                  type: 'string'
                },
                cnpj: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                }
              },
              person: {
                name: {
                  type: 'string'
                },
                cpf: {
                  type: 'string'
                },
                birth: {
                  type: 'string'
                }
              }
            },
            example: {
              access_level: 'client',
              username: 'username',
              hashed_password: 'passwordExample',
              email: 'user@provider.com',
              phone: '91999999999',
              company: {
                name: 'Company name',
                trade_name: 'Company trade name',
                cnpj: '00000000000000',
                description: 'Description company'
              },
              person: {
                name: 'Person name',
                cpf: '00000000000',
                birth: '12121990'
              }
            }
          }
        }
      }
    },
    responses: {
      '201': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user created'
              }
            }
          }
        }
      },
      '403': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'admin access only'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  list: {
    summary: 'List all users',
    parameters: [
      {
        in: 'header',
        name: 'user.access_level',
        type: 'string',
        required: 'true'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  access_level: {
                    type: 'string'
                  },
                  username: {
                    type: 'string'
                  },
                  hashed_password: {
                    type: 'string'
                  },
                  email: {
                    type: 'string'
                  },
                  phone: {
                    type: 'string'
                  },
                  created_at: {
                    type: 'string'
                  },
                  updated_at: {
                    type: 'string'
                  }
                }
              },
              example: [
                {
                  id: 12,
                  access_level: 'client',
                  username: 'joao',
                  email: 'joao@provider.com',
                  phone: '91999999999',
                  created_at: '2021-09-03T15:42:48.906Z',
                  updated_at: '2021-09-03T15:43:24.006Z'
                },
                {
                  id: 32,
                  access_level: 'admin',
                  username: 'fernando',
                  email: 'fernando@provider.com',
                  phone: '91988888888',
                  created_at: '2021-09-03T16:20:32.212Z',
                  updated_at: '2021-09-03T16:20:32.212Z'
                }
              ]
            }
          }
        }

      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'users not found'
              }
            }
          }
        }
      },
      '403': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'admin access only'
              }
            }
          }
        }
      },
      '401 (JWT malformed)': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'message: jwt malformed'
              }
            }
          }
        }
      },
      '401 (Token expired)': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'message: jwt expired'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  data: {
    summary: 'Return the target user data',
    security: [
      {
        'bearerAuth': []
      }
    ],
    parameters: [
      {
        in: 'query',
        name: 'id',
        type: 'string',
        required: 'true'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                access_level: {
                  type: 'string'
                },
                username: {
                  type: 'string'
                },
                hashed_password: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                company: {
                  name: {
                    type: 'string'
                  },
                  trade_name: {
                    type: 'string'
                  },
                  cnpj: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  }
                },
                person: {
                  name: {
                    type: 'string'
                  },
                  cpf: {
                    type: 'string'
                  },
                  birth: {
                    type: 'string'
                  }
                }
              },
              example: {
                access_level: 'client',
                username: 'username',
                hashed_password: 'passwordExample',
                email: 'user@provider.com',
                phone: '91999999999',
                company: {
                  name: 'Company name',
                  trade_name: 'Company trade name',
                  cnpj: '00000000000000',
                  description: 'Description company'
                },
                person: {
                  name: 'Person name',
                  cpf: '00000000000',
                  birth: '12121990'
                }
              }
            }
          }
        }
      },
      '401 (JWT malformed)': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'message: jwt malformed'
              }
            }
          }
        }
      },
      '401 (Token expired)': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'message: jwt expired'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  update: {
    summary: 'Update user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              access_level: {
                type: 'string'
              },
              username: {
                type: 'string'
              },
              hashed_password: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              company: {
                name: {
                  type: 'string'
                },
                trade_name: {
                  type: 'string'
                },
                cnpj: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                }
              },
              person: {
                name: {
                  type: 'string'
                },
                cpf: {
                  type: 'string'
                },
                birth: {
                  type: 'string'
                }
              }
            },
            example: {
              id: 24,
              access_level: 'client',
              username: 'modifiedusername',
              hashed_password: 'modifiedpasswordExample',
              email: 'usermodified@provider.com',
              phone: '91999999999',
              company: {
                name: 'Modified company name',
                trade_name: 'Company trade name',
                cnpj: '00000000000000',
                description: 'Description company'
              },
              person: {
                name: 'Modified person name',
                cpf: '00000000000',
                birth: '12121990'
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user updated'
              }
            }
          }
        }

      },
      '403': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'admin access only'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'target user not found'
              }
            }
          }
        }
      },
      '412': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing arguments'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  },
  delete: {
    summary: 'Delete user',
    parameters: [
      {
        in: 'query',
        name: 'id',
        type: 'string',
        required: 'true'
      }
    ],
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'user deleted'
              }
            }
          }
        }
      },
      '403': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'admin access only'
              }
            }
          }
        }
      },
      '404': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'target user not found'
              }
            }
          }
        }
      },
      '412': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: 'missing arguments'
              }
            }
          }
        }
      },
      '500': {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: {
                message: '<<error message>>'
              }
            }
          }
        }
      }
    }
  }
}
