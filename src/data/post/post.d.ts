type PostEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorAvatar: string | null;
  abstract: string;
  title: string;
  thumbnail: string;
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
};

type UserEntity = {
  [key in string]: {
    name: string;
    avatarUrl: string | null;
  };
};

type NotionHeadingEl = {
  headingNumber: number;
  id: string;
  text: string;
};
