import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  // Apollo GraphQL Configuration
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,          // ← generates all types from your content types
      depthLimit: 10,
      defaultLimit: 25,
      maxLimit: 100,
      landingPage: true,  // sandbox in dev only
      apolloServer: {
        introspection: true
      },
    },
  },
  
  // Swagger UI (REST API Documentation) Configuration
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Strapi API Documentation',
        description: 'REST API Documentation for my Strapi v5 App',
        termsOfService: 'Dont touch that',
        contact: {
          name: 'FitFud Team',
          email: 'khiemnpq23406@st.uel.edu.vn',
          url: process?.env?.STRAPI_URL ?? process?.env?.LOCAL_STRAPI_URL ?? "random.com",
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      'x-strapi-config': {
        // Defines the route where the Swagger UI will be accessible
        path: '/documentation',
        showRequests: true,
      },
    },
  },
});

export default config;