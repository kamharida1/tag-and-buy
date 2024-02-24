import { ComponentProps, Ref, forwardRef, memo, useEffect, useState } from "react";
import { Image } from "react-native";
import { supabase } from "../../lib/supabase";
import Animated from "react-native-reanimated";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = forwardRef((props: RemoteImageProps, ref: Ref<Image>) => { 
  const { path, fallback, ...imageProps } = props;  
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!path) return;
    (async () => {
      const { data } = await supabase.storage
        .from("product-images")
        .getPublicUrl(path as string);

      setImage(data.publicUrl);
      // if (error) {
      //   console.log(error);
      // }

      // if (data) {
      //   const fr = new FileReader();
      //   fr.readAsDataURL(data);
      //   fr.onload = () => {
      //     setImage(fr.result as string);
      //   };  
      // }
    })();
  }, [path]);

  if (!image) {
  }

  return <Image ref={ref} source={{ uri: image || fallback }} {...imageProps} />;
});

export {RemoteImage}