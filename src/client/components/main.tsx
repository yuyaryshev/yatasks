import React from "react";
import { useObserver } from "mobx-react-lite";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import debugjs from "debug";
import { MainModel } from "../models/index.js";
import { MainPage } from "./MainPage.js";
import { MessageBox } from "./MessageBox.js";

const debugRender = debugjs("render");
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridContainer: {
            display: "grid",
            gridTemplateAreas: `
            "header header"
            "sideBar editor"
            `,

            gridTemplateColumns: "1fr 3fr",
            gridTemplateRows: "64px 1fr",
            width: "100%",
            height: "100%",
        },
        projects: {},
        fileTree: {},
        header: {
            gridArea: "header",
        },
        sideBar: {
            gridArea: "sideBar",
            display: "flex",
            flexDirection: "column",
        },
        editor: {
            width: "100%",
            height: "100%",
            gridArea: "editor",
        },
        editor2: {
            width: "100%",
            height: "100%",
        },
        root: {
            flexGrow: 1,
            width: "100%",
            height: "100%",
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        button: {},
        list: {
            width: 250,
        },
    })
);
// pageBackground: {
//     //        boxSizing: "border-box",
//     //        background: "#aa0a1e",
//     background: ytheme.backgroundColor,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     flexGrow: 1,
//     width: "100%",
//     height: "100%",
// },
// pageMiddle: {
//     width: ytheme.middleWidth,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "stretch",
// },
export const Main: React.FC<{ m: MainModel }> = ({ m }) => {
    return useObserver(() => {
        const classes = useStyles();
        debugRender("UIRunStatus");

        const curTime = new Date().toISOString() as string;

        let message;
        let messageTitle;

        return (
            <>
                <MessageBox messageBoxModel={m.messageBoxModel} />
                <MainPage m={m} />
                <Drawer open={m.drawerOpen} onClose={m.toggleDrawer}>
                    <div
                        className={classes.list}
                        role="presentation"
                        onClick={m.toggleDrawer}
                        onKeyDown={m.toggleDrawer}
                    >
                        <List>
                            <ListItem button key={"item0"} onClick={() => {}}>
                                <ListItemIcon>
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Select project"} />
                            </ListItem>
                            <ListItem button key={"item1"}>
                                <ListItemIcon>
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary={"item1"} />
                            </ListItem>
                            <ListItem button key={"item2"}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={"item2"} />
                            </ListItem>
                        </List>
                        {/*<Divider />*/}
                    </div>
                </Drawer>
            </>
        );
    });
};

// setTimeout(async ()=>{
//     console.log("Started MessageBox");
//     const messageBoxResult = await mainModel.messageBox({name:"messageBoxTitle", text:"message box Text", okCancel: true});
//     console.log("Finished MessageBox", {messageBoxResult});
// }, 3000);

if ((module as any).hot) {
    (module as any).hot.accept();
}

/*
<Container className={classes.pageBackground}>
    <Container className={classes.pageMiddle}>
    </Container>
</Container>
*/
