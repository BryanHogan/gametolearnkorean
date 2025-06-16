import words from "$lib/data/words.json";

const withExperience = arr => arr.map(w => ({ ...w, experience: 0 }));

let wordData;
if (typeof window !== "undefined") {
    const stored = localStorage.getItem("wordData");
    wordData = stored ? JSON.parse(stored) : withExperience(words);
} else {
    wordData = withExperience(words);
}

const saveWordData = () => {
    if (typeof window !== "undefined") {
        localStorage.setItem("wordData", JSON.stringify(wordData));
    }
};

const updateExperience = (koreanWord, englishWord, experienceAmount = 1) => {
    const word = wordData.find(
        w => w.korean === koreanWord && w.english === englishWord
    );
    if (word) {
        word.experience += experienceAmount;
        saveWordData();
    }
};

export { wordData, saveWordData, updateExperience };
