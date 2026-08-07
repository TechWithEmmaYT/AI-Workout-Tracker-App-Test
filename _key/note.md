## gradle.properties

MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=1fb9a436b6c001a3dedbdb1de6404b023ae0ba1e7445ea75e912c0c10804e611
MYAPP_UPLOAD_KEY_PASSWORD=1fb9a436b6c001a3dedbdb1de6404b023ae0ba1e7445ea75e912c0c10804e611

## buil.gradle

release {
if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
storeFile file("./my-upload-key.keystore")
storePassword MYAPP_UPLOAD_STORE_PASSWORD
keyAlias MYAPP_UPLOAD_KEY_ALIAS
keyPassword MYAPP_UPLOAD_KEY_PASSWORD
}
}

           signingConfig signingConfigs.release
