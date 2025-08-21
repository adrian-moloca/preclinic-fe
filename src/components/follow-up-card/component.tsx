import { 
    Paper, 
    TextField, 
    Typography, 
    FormControl, 
    Select, 
    MenuItem, 
    Box,
    Grid,
    useTheme
} from "@mui/material";
import { FC, useState } from "react";
import { DividerFormWrapper } from "../create-leaves-form/style";

export const FollowUpCard: FC = () => {
    const theme = useTheme(); 
    const [emptyStomach, setEmptyStomach] = useState('');

    return (
        <Paper sx={{ 
          marginTop: 2, 
          padding: 3,
          backgroundColor: theme.palette.background.paper, 
          color: theme.palette.text.primary, 
        }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Follow Up
            </Typography>
            <DividerFormWrapper />
            
            <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Grid>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                            Follow Up Date
                        </Typography>
                        <TextField 
                            fullWidth
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                width: '590px',
                            }}
                        />
                    </Grid>
                    
                    <Grid>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                            Whether to come on empty Stomach
                        </Typography>
                        <FormControl fullWidth sx={{ width: "590px" }}>
                            <Select
                                value={emptyStomach}
                                onChange={(e) => setEmptyStomach(e.target.value)}
                                displayEmpty
                                sx={{
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    }
                                }}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};