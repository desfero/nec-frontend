export const withParams = (route: string, params: any) =>
  route.replace(/:(\w+)/g, (_, match) => {
    const replacement = params[match];

    if (!replacement) {
      throw new Error(`There is no match for ${match} in route ${route}`);
    }

    return replacement;
  });

export const insecureWithParams = (route: string, params: any) =>
  route.replace(/:(\w+)/g, (_, match) => params[match]);
