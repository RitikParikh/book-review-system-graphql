import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { Context } from '../middleware/interface';
import { authMiddleware } from '../middleware/authMiddleware';

interface AuthDirective {
  name: 'auth';
}

export function authDirectiveTransformer(schema: GraphQLSchema, directiveName: 'auth'): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0] as AuthDirective;
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any,
          args: any,
          context: Context,
          info: any
        ): Promise<any> {
            await authMiddleware(context);
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    }
  });
}