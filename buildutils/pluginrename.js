import { readdir, readFile, rename, writeFile } from 'fs'
import { dirname, extname, join, parse } from 'path'

// Directory to scan
const directoryPath = 'dist/assets'

function handleFiles(oldName, newName) {
  // Old and new filenames (without extensions)
  const oldFileNameWithoutExt = oldName
  const newFileNameWithoutExt = newName

  // Function to replace occurrences in other files' content
  function replaceInOtherFiles(directoryPath, oldFileName, newFileName, fileToExclude) {
    readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err)
        
        return
      }

      files.forEach(file => {
        const filePath = join(directoryPath, file)

        // Skip the file that's being renamed
        if (file === fileToExclude) return

        // Read the content of the current file
        readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${filePath}:`, err)
            
            return
          }

          // Check if the file content contains the old filename
          if (data.includes(oldFileName)) {
            // Replace the old filename with the new one in the content
            const updatedContent = data.replace(new RegExp(oldFileName, 'g'), newFileName)

            // Write the updated content back to the file
            writeFile(filePath, updatedContent, 'utf8', err => {
              if (err) {
                console.error(`Error writing file ${filePath}:`, err)
                
                return
              }
              console.log(`Replaced '${oldFileName}' with '${newFileName}' in ${filePath}`)
            })
          }
        })
      })
    })
  }

  // Function to rename the target file after replacing its name in other files
  function renameFile(filePath, oldFileName, newFileName) {
    const ext = extname(filePath) // Keep the original file extension
    const newFilePath = join(dirname(filePath), newFileName + ext)

    rename(filePath, newFilePath, err => {
      if (err) {
        console.error(`Error renaming file ${filePath} to ${newFilePath}:`, err)
        
        return
      }
      console.log(`Renamed file from '${oldFileName}' to '${newFileName}'`)
    })
  }

  // Function to iterate over files in the directory
  function processFilesInDirectory(directoryPath) {
    readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err)
        
        return
      }

      // Loop through the files and find the one matching the old filename (without extension)
      files.forEach(file => {
        const filePath = join(directoryPath, file)
        const fileNameWithoutExt = parse(file).name // Get filename without extension

        // If the file matches the old filename (without extension)
        if (fileNameWithoutExt === oldFileNameWithoutExt) {
          // First, replace occurrences in other files
          replaceInOtherFiles(directoryPath, oldFileNameWithoutExt, newFileNameWithoutExt, file)

          // Then, rename the file
          renameFile(filePath, oldFileNameWithoutExt, newFileNameWithoutExt)
        }
      })
    })
  }

  // Start the process
  processFilesInDirectory(directoryPath)
}

const filesToProcess = {
  "plugin-vue_export-helper-DlAUqK2U": "plugin-vue_export-helper-DlAUqK2U",
  "commonjsHelpers-Cpj98o6Y": "commonjsHelpers-Cpj98o6Y",
}

for (const [oldName, newName] of Object.entries(filesToProcess)) {
  handleFiles(oldName, newName)
}
