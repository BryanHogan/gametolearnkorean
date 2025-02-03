import words from "$lib/data/words.json";

let wordData = [];
if (typeof window !== "undefined") {
    wordData = JSON.parse(localStorage.getItem("wordData")) || words;
} else {
    wordData = words;
}

const saveWordData = () => {
    if (typeof window !== "undefined") {
        localStorage.setItem("wordData", JSON.stringify(wordData));
    }
};

const updateExperience = (koreanWord, englishWord, experience) => {
    const word = wordData.find(w => w.korean === koreanWord && w.english === englishWord);
    if (word) {
        word.experience += experience;
        saveWordData();
    }
};

export { wordData, saveWordData, updateExperience };