import { createClient } from "contentful";
import dotenv from "dotenv";
console.log(process.env);

export default createClient({
  space: process.env.REACT_APP_SPACE,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN
});
