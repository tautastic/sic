export type GlobalNavChild = {
  name: string;
  path: string;
  slug: string;
  text?: string;
};

export type GlobalNavParent = {
  name: string;
  path: string;
  slug: string;
  text?: string;
  children?: GlobalNavChild[];
};
