import { Box, Typography, TextField, Button, Divider } from "@mui/material";

function Home() {
  return (
    <>
      <Typography variant="h2" component="h2">
        Home{" "}
      </Typography>

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Comment"
          placeholder="글을 입력해주세요."
          type="text"
          name="comment"
          variant="outlined"
          multiline
          rows={5}
        />
        <Button sx={{ mt: 2 }} type="submit" variant="contained">
          글쓰기
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />
    </>
  );
}

export default Home;
