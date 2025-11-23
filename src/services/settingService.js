import fs from "fs";
import path from "path";
import { app } from "electron";
import crypto from "crypto";


const HIDDEN_DIR_NAME = ".howaboutquestion";
const SETTING_FILE_NAME = "setting.dat";



/**
 * Documents(문서) 안에 setting 파일 주소를 가져옵니다.
 * 없는 경우 해당 위치에 숨김 폴더로 .howaboutquestion 생성
 * @returns setting 파일 주소 반환
 */
function getSettingFilePath() {
    // Documents 주소 가져오기
    const documentPath = app.getPath("documents");

    // Documents + /폴더명 
    const hiddenDirPath = path.join(documentPath, HIDDEN_DIR_NAME);

    // 해당 주소에 폴더가 없으면 폴더 만들기
    if (!fs.existsSync(hiddenDirPath)) {
        fs.mkdirSync(hiddenDirPath, { recursive: true });
    }

    // 파일 주소 반환
    return path.join(hiddenDirPath, SETTING_FILE_NAME);
}

/**
 * UUID를 생성합니다.
 * Node 16 미만에서는 crypto가 안되는 경우도 있어서 예외 처리를 했습니다.
 * @returns 생성한 UUID 반환
 */
function creatUuid() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    // Node 16미만 버전 지원
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g, c =>
            (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
        );
}

/**
 * setting 파일에 있는 값들 반환 (지금은 UUID만 존재)
 * @returns setting 파일 값 반환
 */
export function getSettingFile() {
    const settingPath = getSettingFilePath();

    // UUID 생성 후 파일에 담아서 파일 생성 및 UUID 반환
    if (!fs.existsSync(settingPath)) {
        const userId = creatUuid();
        const initialSetting = { userId }; // 나중에 다크모드, 언어 등 옵션 추가 시 수정
        fs.writeFileSync(settingPath, JSON.stringify(initialSetting, null, 2), {
            encoding: "utf-8",
        });

        return initialSetting;
    }

    // 존재한다면 파일 읽기
    const settingFile = fs.readFileSync(settingPath, "utf-8");
    try {
        const parsed = JSON.parse(settingFile);
        // 파일에 userId가 없다면 UUID 다시 생성 후 저장 및 UUID 반환
        if (!parsed.userId) {
            parsed.userId = creatUuid();
            fs.writeFileSync(settingPath, JSON.stringify(parsed, null, 2), {
                encoding: "utf-8",
            });
        }
        return parsed;
    } catch (e) {
        const userId = creatUuid();
        const resetSetting = { userId };
        fs.writeFileSync(settingPath, JSON.stringify(resetSetting, null, 2), {
            encoding: "utf-8",
        })
        return resetSetting;
    }
}

/**
 * window 실행 전에 uuid 가져오는 함수 (window() 이후 아톰에서 사용할 것)
 * @returns setting 파일 안에 있는 UUID 반환
 */
export function getUserId(){
    const setting = getSettingFile();
    return setting.userId;
}