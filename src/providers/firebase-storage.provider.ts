import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';

import * as path from 'path';
import { initializeFirebaseApp } from '../config/firebase.config';

@Injectable()
export class FirebaseStorageProvider {
  public async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ fullName: string; name: string }> {
    initializeFirebaseApp();
    const storage = getStorage();

    const fileName = `${path
      .parse(file.originalname)
      .name.replace(/\s/g, '')}__${uuidv4()}`;
    const fileExtension = path.parse(file.originalname).ext;
    const fullName = `${folder}/${fileName}${fileExtension}`;

    const fileRef = ref(storage, fullName);

    const uploaded = await uploadBytes(fileRef, file.buffer, {
      contentType: 'image',
    });

    return { fullName, name: uploaded.metadata.name };
  }

  public async delete(path: Image['path']): Promise<string> {
    const storage = getStorage();
    const fileRef = ref(storage, path);
    try {
      await deleteObject(fileRef);
    } catch (e) {
      return `can't remove this image`;
    }

    return `image successfully deleted`;
  }
}
