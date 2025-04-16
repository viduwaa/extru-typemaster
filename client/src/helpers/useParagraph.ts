/* import axios from "axios";
import React, { useEffect, useState } from "react";

export const useParagraph = () => {
    const [paragraph, setParagraph] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    "http://metaphorpsum.com/paragraphs/2/4"
                );
                const cleanedData = response.data
                    .toLowerCase()
                    .replace(/[^\w\s]/gi, "")
                    .split(" ");
                setParagraph(cleanedData);
            } catch (error) {
                console.log(error);
            }finally{
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return { paragraph,isLoading  };
}; */


import { useEffect, useState } from "react";

export const useParagraph = () => {
  const [paragraph, setParagraph] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(import.meta.env.VITE_SERVER_URI+'/api/paragraphs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        const cleanedData = data.toLowerCase().replace(/[^\w\s]/gi, "").split(" ");
        setParagraph(cleanedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching paragraph:', error);
        // Set fallback paragraph in case of error
        const fallback = "The quick brown fox jumps over the lazy dog";
        setParagraph(fallback.toLowerCase().split(" "));
      }
    };

    fetchParagraph();
  }, []);

  return { paragraph , isLoading };
};