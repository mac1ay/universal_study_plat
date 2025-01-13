import { readdirSync } from "fs"
import { isAbsolute, join, resolve } from "path"

export function findFiles(folderPath) {
    const files = []
    folderPath = isAbsolute(folderPath) ? folderPath : join(process.cwd(), folderPath)
    const folder = readdirSync(folderPath, { withFileTypes: true })

    for(const file of folder) {
        const pathFile = resolve(folderPath, file.name)
        if(file.isDirectory()){
            files.push(...findFiles(pathFile))
            continue
        }
        files.push(pathFile)
    }
    return files;
}
  