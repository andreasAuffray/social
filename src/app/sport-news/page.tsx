'use client';

import { createPost } from '@/actions/post.action';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router'

const API_KEY = '67e01ecd720fe2783386050f52eb5fc5'; // Remplace par ta clé API GNews
const API_URL = `https://gnews.io/api/v4/top-headlines?topic=sports&lang=fr&token=${API_KEY}`;

interface Article {
  title: string;
  description: string;
  url: string;
  image: string; 
  publishedAt: string;
  source: {
    name: string;
  };
}

const SportsNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (!data.articles) {
          throw new Error('Format de réponse invalide.');
        }
        setArticles(data.articles);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des actualités :', err);
        setError('Impossible de charger les actualités sportives.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const Repost = async (article: Article) => {
    try {
     const content = `${article.title}  \n ${article.description} \n ${article.url} `;
     
     const result = await createPost(content, article.image);
      if (result && result.success) {
        alert('Article republié avec succès!');
        
      } else {
        throw new Error(result?.error || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur lors de la republication de l\'article :', err);
      alert('Erreur lors de la republication de l\'article.');
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📰 Actualités Sportives</h1>
      {loading ? (
        <p className="text-center">Chargement des actualités...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={article.image ? article.image : "/placeholder.jpg"} 
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold titre-article text-black">{article.title}</h2> 
                <p className="text-sm text-gray-600">
                  {article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-gray-700">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-blue-600 hover:underline"
                >
                  Lire l'article →
                </a>
                <div>
                <Button onClick={() => Repost(article)}>
                    Republier
                  </Button>

                </div>
                
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportsNews;
