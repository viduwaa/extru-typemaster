import axios from "axios";
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
};


