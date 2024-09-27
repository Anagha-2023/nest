import app from './app';
import connectDB from '../config/dbconfig';
import {PORT} from '../config/serverconfig';

connectDB();

app.listen(PORT, ()=>{
  console.log(`server started on http://localhost:${PORT}`);
})