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
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import { db, storageService } from "../firebase";
import { ref } from "firebase/storage";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Comment from "../components/Comment";

function Home({ userId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const storage = storageService; // 필수가 아님! 메뉴얼대로 하는중..! 이름 아바꿨으면 이런단계가 필요가 없다..? 스토리지 초기화 부분
  const storageRef = ref(storage); // 참조 초기화

  const handleChange = e => {
    setComment(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const storageRef = ref(storage, `${userId}/${uuidv4()}`);
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

  const onFileChange = e => {
    // console.log(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      setAttachment(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onClearFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            component="label"
            sx={{ mt: 1 }}
            type="button"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            이미지 선택
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={onFileChange}
            />
          </Button>
          {attachment && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={attachment}
                alt="미리보기"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                }}
              ></Box>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={onClearFile}
              >
                파일 첨부 취소
              </Button>
            </Box>
          )}
        </Box>
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
