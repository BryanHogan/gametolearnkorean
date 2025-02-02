import { assemble, disassemble } from "es-hangul";

const consonants = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
const vowels = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");

const commonKoreanBlocks = [
    "가", "나", "다", "라", "마", 
    "바", "사", "아", "자", "차",
    "카", "타", "파", "하", "거", 
    "너", "더", "러", "머", "버", 
    "서", "어", "저", "처", "커", 
    "터", "퍼", "허", "고", "노", 
    "도", "로", "모", "보"
];

export function getSimilarBlock(block) {
    let splitted = [...disassemble(block)]; 

    if (splitted.length < 1 || splitted.length > 4) return block;

    let index = Math.floor(Math.random() * splitted.length);
    let char = splitted[index];

    if (consonants.includes(char)) {
        splitted[index] = consonants[Math.floor(Math.random() * consonants.length)];
    } else if (vowels.includes(char)) {
        splitted[index] = vowels[Math.floor(Math.random() * vowels.length)];
    } else {
        return block;
    }

    let newBlock = assemble(splitted);

    if (newBlock === "" || newBlock.length === 0 || newBlock.length > 1) {
        return getSimilarBlock(block);
    }

    return newBlock;
}

function getRandomKoreanBlock() {
    const randomIndex = Math.floor(Math.random() * commonKoreanBlocks.length);
    return commonKoreanBlocks[randomIndex];
}

export function testString() {
    return disassemble('값');
}