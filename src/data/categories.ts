import { icons } from "lucide-react";
import { NewsAPICategory } from "~/types";

export const categoriesMenu: { key: NewsAPICategory; title: string; description: string; icon: keyof typeof icons }[] =
  [
    {
      key: "business",
      title: "Bisnis",
      description: "Berita seputar dunia bisnis",
      icon: "Briefcase",
    },
    {
      key: "entertainment",
      title: "Hiburan",
      description: "Berita seputar dunia hiburan",
      icon: "Film",
    },
    {
      key: "general",
      title: "Umum",
      description: "Berita seputar semua topik",
      icon: "Globe",
    },
    {
      key: "health",
      title: "Kesehatan",
      description: "Berita seputar dunia kesehatan",
      icon: "Heart",
    },
    {
      key: "science",
      title: "Sains",
      description: "Berita seputar dunia sains",
      icon: "FlaskConical",
    },
    {
      key: "sports",
      title: "Olahraga",
      description: "Berita seputar dunia olahraga",
      icon: "Award",
    },
    {
      key: "technology",
      title: "Teknologi",
      description: "Berita seputar dunia teknologi",
      icon: "Smartphone",
    },
  ];
