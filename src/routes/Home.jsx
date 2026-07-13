import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  useScrollTrigger,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import Comment from "../components/Comment";

function Home({ userId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleChange = e => {
    setComment(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        // comment: comment,
        comment,
        date: serverTimestamp(),
        uid: userId,
      });
      setComment("");
      // getComments();
    } catch (e) {
      console.error("글 추가시 에러가 발생했습니다.", e);
    }
  };

  // useEffect(() => {
  //   const getComments = async () => {
  //     const q = query(collection(db, "comments"));
  //     const querySnapshot = await getDocs(q);
  //     const commentList = [];

  //     querySnapshot.forEach(doc => {
  //       commentList.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });
  //     setComments(commentList);
  //   };
  // });
  const getComments = async () => {
    const q = query(
      collection(db, "comments"),
      orderBy("date", "desc"),
      limit(5),
    );
    onSnapshot(q, querySnapshot => {
      const commentsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });
  };

  useEffect(() => {
    getComments();
  }, []);
  console.log(comments);

  return (
    <>
      <Typography variant="h2" component="h2">
        Home{" "}
      </Typography>

      <Box component="form" sx={{ mt: 2 }} onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="Comment"
          placeholder="글을 입력해주세요."
          type="text"
          name="comment"
          variant="outlined"
          multiline
          rows={5}
          value={comment}
          onChange={handleChange}
        />
        <Button sx={{ mt: 2 }} type="submit" variant="contained">
          글쓰기
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />
      <List sx={{ width: "100%" }}>
        {/*comments배열의 값을 ListItem으로 출력 */}
        {/* {comments.map(comment => (
          <div key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={comment.comment}
                secondary={comment.date?.toDate().toLocaleString()}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))} */}
        {comments.map(item => (
          <Comment key={item.id} item={item} isShown={userId === item.uid} />
        ))}
      </List>
    </>
  );
}

export default Home;
