import fs from "fs";
import path from "path";
import { app } from "electron";
import crypto from "crypto";
import { userDataPath } from "../config/paths.js";


const SETTING_FILE_NAME = ".setting.dat";



/**
 * appData안에 setting 파일 주소를 가져옵니다.
 * @returns setting 파일 주소 반환
 */
function getSettingFilePath() {
    
    return path.join(userDataPath, SETTING_FILE_NAME);
}

/**
 * UUID를 생성합니다.
 * @returns 생성한 UUID 반환
 */
function creatUuid() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
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