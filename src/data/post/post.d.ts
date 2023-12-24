type PostEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  abstract: string;
  title: string;
  thumbnail: string;
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
};
