import {
  Divider,
  ListItem,
  ListItemText,
  Stack,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { db, storageService } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useState } from "react";

function Comment({ item, isShown }) {
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState(item.comment);
  // const isDelete = confirm("정말 삭제하시겠습니까?");

  // if (!isDelete) return;

  // try {
  //   await deleteDoc(doc(db, "comments", item.id));
  // } catch (error) {
  //   console.error(error);
  // }
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteDoc(doc(db, "comments", item.id));

      if (item.image) {
        const storage = storageService;
        const storageRef = ref(storage, item.image);
        await deleteObject(storageRef);
        // await deleteObject(item.image);
      }
    } catch (error) {
      console.error("삭제오류", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleEditMode = () => {
    setEdit(prev => !prev);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const commentRef = doc(db, "comments", item.id);
    // Set the "capital" field of the city 'DC'
    await updateDoc(commentRef, {
      comment: comment,
    });
    setEdit(false);
  };

  const handleChange = e => {
    setComment(e.target.value);
  };
  return (
    <ListItem kiy={item.id} alignItems="flex-start" divider>
      {edit ? (
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Comment"
            multiline
            rows={5}
            value={comment}
            onChange={handleChange}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              sx={{ mt: 2 }}
              type="submit"
              variant="contained"
              size="small"
            >
              글쓰기
            </Button>
            <Button variant="outlined" size="small" onClick={toggleEditMode}>
              취소
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <ListItemText
            primary={item.comment}
            secondary={
              item.date?.toDate
                ? item.date.toDate().toLocaleString()
                : "작성시간 없음"
            }
          />
          {/* // 이미지가 있으면 이미지 출력 */}
          {item.image && (
            <Box
              sx={{
                marginRight: "5px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt="첨부 이미지"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                }}
              />
            </Box>
          )}

          {isShown && (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={toggleEditMode}>
                수정
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Stack>
          )}
        </>
      )}
    </ListItem>
  );
}
export default Comment;
