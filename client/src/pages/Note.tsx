import { useParams } from "react-router-dom";

export default function Note() {
  const params = useParams<{noteId:string}>();
  return <>ID: {params.noteId}</>;
}
