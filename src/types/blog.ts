
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  image?: string;
  tags: string[];
  slug: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  searchTerm?: string;
}

export interface BlogItemProps {
  post: BlogPost;
}

export interface BlogPostProps {
  post: BlogPost;
}
