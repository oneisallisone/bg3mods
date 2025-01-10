declare module "*.json" {
  const value: {
    title: {
      en: string;
      zh: string;
    };
    description: {
      en: string;
      zh: string;
    };
    links: Array<{
      name: {
        en: string;
        zh: string;
      };
      url: string;
    }>;
  };
  export default value;
}