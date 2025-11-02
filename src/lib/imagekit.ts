import ImageKit from 'imagekit-javascript';

const imageKit = new ImageKit({
  publicKey: 'public_6F7KIvmANRRlg+HBY58Dt+1KLq0=',
  urlEndpoint: 'https://ik.imagekit.io/fjn9qk47o/',
  authenticationEndpoint: 'https://ik.imagekit.io/fjn9qk47o/',
});

export default imageKit;

export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    const result = await new Promise((resolve, reject) => {
      imageKit.upload(
        {
          file: file,
          fileName: `${Date.now()}-${file.name}`,
          tags: ['fashion-catalogue'],
        },
        (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return (result as any).url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

export const getImageUrl = (fileId: string): string => {
  return `https://ik.imagekit.io/fjn9qk47o/${fileId}`;
};
