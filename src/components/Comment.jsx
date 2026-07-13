import { Divider, ListItem, ListItemText, Stack, Button } from "@mui/material";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

function Comment({ item, isShown }) {
  // const isDelete = confirm("정말 삭제하시겠습니까?");

  // if (!isDelete) return;

  // try {
  //   await deleteDoc(doc(db, "comments", item.id));
  // } catch (error) {
  //   console.error(error);
  // }
  const handleDelete = async () => {
    // if (window.confirm("정말 삭제할까요?")) {
    //   // or if (!window.confirm('정말 삭제할까요?')) return;
    //   await deleteDoc(doc(db, "comments", item.id));
    // }
    try {
      await deleteDoc(doc(db, "comments", item.id));
      console.log("삭제 성공:", item.id);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <ListItem key={item.id} alignItems="flex-center" divider>
      <ListItemText
        primary={item.comment}
        secondary={
          item.date?.toDate
            ? item.date.toDate().toLocaleString()
            : "작성시간 없음"
        }
      />
      {isShown && (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small">
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
    </ListItem>
  );
}
export default Comment;
