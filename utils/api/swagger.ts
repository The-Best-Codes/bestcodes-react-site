import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BestCodes Site API",
      version: "1.0.0",
      description: "API documentation for my Next.js website",
    },
    servers: [
      {
        url: "https://bestcodes.dev",
        description: "Production server",
      },
    ],
  },
  apis: ["./app/api/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
