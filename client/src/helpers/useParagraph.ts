import axios from "axios";
import React, { useEffect } from "react";

export const useParagraph = () => {
    const [paragraph, setParagraph] = React.useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
            }
        };
        fetchData();
    }, []);

    return { paragraph };
};


