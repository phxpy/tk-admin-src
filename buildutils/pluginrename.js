import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

// Function to get all files recursively in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath)

  files.forEach(file => {
    const filePath = join(dirPath, file)
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })
  
  return arrayOfFiles
}

// Function to rename the target file and its mentions
function renameFileAndReferences(dir, oldFileName, newFileName) {
  const allFiles = getAllFiles(dir)

  // Find and rename the target file
  const oldFilePath = allFiles.find(filePath => filePath.includes(oldFileName))
  if (!oldFilePath) {
    console.error(`File ${oldFileName} not found.`)
    
    return
  }
  
  const newFilePath = oldFilePath.replace(oldFileName, newFileName)

  renameSync(oldFilePath, newFilePath)
  console.log(`Renamed ${oldFilePath} to ${newFilePath}`)

  // Replace file mentions in other files
  allFiles.forEach(file => {
    if (file !== newFilePath) { // Skip the renamed file
      let content = readFileSync(file, 'utf-8')
      if (content.includes(oldFileName)) {
        const updatedContent = content.replace(new RegExp(oldFileName, 'g'), newFileName)

        writeFileSync(file, updatedContent, 'utf-8')
        console.log(`Updated mentions in ${file}`)
      }
    }
  })
}

// Example usage
const directoryPath = './dist' // Replace with your directory
const oldFileName = '_plugin-vue_export-helper-DlAUqK2U.js' // Replace with the file name to rename
const newFileName = 'plugin-vue_export-helper-DlAUqK2U.js' // Replace with the new file name

console.log("-------------------------------------------------")
renameFileAndReferences(directoryPath, oldFileName, newFileName)
