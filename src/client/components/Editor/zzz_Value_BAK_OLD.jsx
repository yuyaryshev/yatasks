// import React, { useRef } from "react";
// import { useLocalStore, useObserver } from "mobx-react-lite";
// import Typography from "@material-ui/core/Typography";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import Checkbox from "@material-ui/core/Checkbox";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import IconButton from "@material-ui/core/IconButton";
// import TextField from "@material-ui/core/TextField";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
// import InputBase from "@material-ui/core/InputBase";
// import { KeyboardDateTimePicker } from "@material-ui/pickers";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import Avatar from "@material-ui/core/Avatar";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import Chip from "@material-ui/core/Chip";
// import { DateTime, Duration } from "luxon";
//
// import debugjs from "debug";
// import { ytheme } from "../ytheme";
// import { EditableValue } from "../../models/edited";
// import { ValueRenderMode } from "../ValueContext";
// import { aggDuration, durationEngStrToDurationObj, durationObjToEngStr } from "Ystd";
//
// const debugRender = debugjs("render");
// type SignChar = "+" | "-";
//
// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         task: {
//             padding: ytheme.padding4,
//             margin: ytheme.margin3,
//             display: "flex",
//             flexDirection: "column",
//         },
//         typography: {
//             margin: ytheme.margin4,
//         },
//         textField: {
//             //margin: ytheme.margin3,
//             padding: "0px",
//         },
//         rating: {
//             margin: ytheme.margin3,
//             fontSize: "4rem",
//             alignSelf: "center",
//         },
//         checkBox: {
//             margin: ytheme.margin3,
//             fontSize: "4rem",
//             alignSelf: "center",
//         },
//         inputRoot: {
//             color: "inherit",
//         },
//         inputInput: {
//             //padding: "inherit",
//             padding: "2px 0px 3px 0px",
//             // // vertical padding + font size from searchIcon
//             // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
//             // transition: theme.transitions.create("width"),
//             // width: "100%",
//             // [theme.breakpoints.up("md")]: {
//             //     width: "20ch",
//             // },
//         },
//     })
// );
//
// export interface ValueProps {
//     m: EditableValue;
//     editor?: boolean;
//     disabled?: boolean;
//     textOnly?: boolean;
//     [key: string]: any;
// }
//
// export const Value: React.FC<{
//     m: EditableValue;
//     mode?: ValueRenderMode;
//     editor?: boolean;
//     disabled?: boolean;
//     textOnly?: boolean;
// }> = ({ m, mode, editor, disabled, textOnly, ...otherProps }) => {
//     const editorRef = useRef(null);
//     const state = useLocalStore(() => ({
//         editing: false,
//         focusedOnce: false,
//         toggleEditing() {
//             state.editing = !state.editing;
//         },
//         turnOffEditing() {
//             state.editing = false;
//         },
//         turnOnEditing() {
//             state.editing = true;
//             state.focusedOnce = false;
//         },
//         // prettier-ignore
//         sign: "+" as SignChar,
//         setSignToPlus() {
//             state.sign = "+";
//         },
//         setSignToMinus() {
//             state.sign = "-";
//         },
//         getDuration() {
//             return durationObjToEngStr(Duration.fromISO(m), 0);
//         },
//         setDuration(eventOrValue: any) {
//             if (m.et !== "duration") {
//                 const error = new Error(
//                     `CODE00000126 Incompartible type: expected 'duration' got '${m.et}'.`
//                 );
//                 console.error(error);
//                 throw error;
//             }
//             const v1 = (eventOrValue.target ? eventOrValue.target.value : eventOrValue) || "";
//             const v2 = durationEngStrToDurationObj(v1);
//             m.set(Duration.fromObject(v2).toISO());
//         },
//         durPlus5m() {
//             if (m.et !== "duration") {
//                 const error = new Error(
//                     `CODE00000127 Incompartible type: expected 'duration' got '${m.et}'.`
//                 );
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = Duration.fromISO(m);
//             vv.minutes += sgn * 5;
//             const avv = Duration.fromObject(aggDuration(vv));
//             m.set(avv.toISO());
//         },
//         durPlus1h() {
//             if (m.et !== "duration") {
//                 const error = new Error(
//                     `CODE00000128 Incompartible type: expected 'duration' got '${m.et}'.`
//                 );
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = Duration.fromISO(m);
//             vv.hours += sgn * 1;
//             const avv = Duration.fromObject(aggDuration(vv));
//             m.set(avv.toISO());
//         },
//         durPlus1d() {
//             if (m.et !== "duration") {
//                 const error = new Error(
//                     `CODE00000129 Incompartible type: expected 'duration' got '${m.et}'.`
//                 );
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = Duration.fromISO(m);
//             vv.days += sgn * 1;
//             const avv = Duration.fromObject(aggDuration(vv));
//             m.set(avv.toISO());
//         },
//         datePlus5m() {
//             if (m.et !== "date") {
//                 const error = new Error(`CODE00000130 Incompartible type: expected 'date' got '${m.et}'.`);
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = DateTime.fromJSDate(m || new Date());
//             const vv2 = vv.plus(sgn * 5 * 60 * 1000);
//             const avv = vv2.toJSDate();
//             m.set(avv);
//         },
//         datePlus1h() {
//             if (m.et !== "date") {
//                 const error = new Error(`CODE00000001 Incompartible type: expected 'date' got '${m.et}'.`);
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = DateTime.fromJSDate(m || new Date());
//             const vv2 = vv.plus(sgn * 60 * 60 * 1000);
//             const avv = vv2.toJSDate();
//             m.set(avv);
//         },
//         datePlus1d() {
//             if (m.et !== "date") {
//                 const error = new Error(`CODE00000002 Incompartible type: expected 'date' got '${m.et}'.`);
//                 console.error(error);
//                 throw error;
//             }
//             const sgn = state.sign === "+" ? 1 : -1;
//             const vv = DateTime.fromJSDate(m || new Date());
//             const vv2 = vv.plus(Duration.fromObject({ days: 1 }));
//             const avv = vv2.toJSDate();
//             m.set(avv);
//         },
//     }));
//
//     return useObserver(() => {
//         debugRender("OLD_Value_Component");
//         const classes = useStyles();
//
//         // @ts-ignore
//         if (!m) return <div>CODE00000003 No value supplied!</div>;
//
//         // const xx = (
//         //     <FormControl disabled>
//         //         <InputLabel>Name</InputLabel>
//         //         <Input value={name} onChange={handleChange} />
//         //         {/*<FormHelperText>Disabled</FormHelperText>*/}
//         //     </FormControl>
//         // );
//         const mode2: ValueRenderMode = (mode === "textInlineEditor" ? "text" : mode) || "form";
//         const onClickToggleEditing = mode === "textInlineEditor" ? state.toggleEditing : undefined;
//
//         switch (m.et) {
//             case "string": {
//                 switch (mode2) {
//                     case "form":
//                         return (
//                             <>
//                                 <InputLabel>{m.prop}</InputLabel>
//                                 <Input
//                                     className={classes.textField}
//                                     value={m[prop]}
//                                     onChange={m.set}
//                                     disabled={disabled}
//                                     {...otherProps}
//                                 />
//                             </>
//                         );
//                     case "text":
//                         if (!state.editing)
//                             return (
//                                 <Typography onClick={onClickToggleEditing} {...otherProps}>
//                                     {m}
//                                 </Typography>
//                             );
//                         else
//                             return (
//                                 <Typography component={"span"} {...otherProps}>
//                                     <InputBase
//                                         ref={editorRef}
//                                         className={classes.textField}
//                                         value={m[prop]}
//                                         onChange={m.set}
//                                         onBlur={state.turnOffEditing}
//                                         autoFocus
//                                         classes={{
//                                             root: classes.inputRoot,
//                                             input: classes.inputInput,
//                                         }}
//                                     />
//                                 </Typography>
//                             );
//                 }
//             }
//             case "boolean": {
//                 return (
//                     <FormControlLabel
//                         control={
//                             <Checkbox
//                                 className={classes.textField}
//                                 checked={!!m}
//                                 onChange={m.set}
//                                 disabled={disabled}
//                                 {...otherProps}
//                             />
//                         }
//                         label={m.prop}
//                     />
//                 );
//             }
//             case "date": {
//                 return (
//                     <div>
//                         <KeyboardDateTimePicker
//                             label={m.prop}
//                             //                            value={DateTime.fromISO("2010-01-01")}
//                             value={m || ""}
//                             onChange={m.set}
//                             onError={console.log}
//                             ampm={false}
//                             //                            format="yyyy-MM-dd HH:mm"
//                             format="dd.MM.yyyy HH:mm"
//                             disablePast
//                             showTodayButton
//                             disabled={disabled}
//                             {...otherProps}
//                         />
//                         <IconButton onClick={state.datePlus5m}>
//                             <Avatar>{state.sign}5m</Avatar>
//                         </IconButton>
//                         <IconButton onClick={state.datePlus1h}>
//                             <Avatar>{state.sign}h</Avatar>
//                         </IconButton>
//                         <IconButton onClick={state.datePlus1d}>
//                             <Avatar>{state.sign}d</Avatar>
//                         </IconButton>
//                     </div>
//                 );
//             }
//             case "duration": {
//                 return (
//                     <>
//                         <InputLabel>{m.prop}</InputLabel>
//                         <Input
//                             className={classes.textField}
//                             value={state.getDuration}
//                             onChange={state.setDuration}
//                             disabled={disabled}
//                             endAdornment={
//                                 <InputAdornment position="end">
//                                     <IconButton onClick={state.durPlus5m}>
//                                         <Avatar>{state.sign}5m</Avatar>
//                                     </IconButton>
//                                     <IconButton onClick={state.durPlus1h}>
//                                         <Avatar>{state.sign}h</Avatar>
//                                     </IconButton>
//                                     <IconButton onClick={state.durPlus1d}>
//                                         <Avatar>{state.sign}d</Avatar>
//                                     </IconButton>
//                                 </InputAdornment>
//                             }
//                             {...otherProps}
//                         />
//                     </>
//                 );
//             }
//             case "enum": {
//                 return (
//                     <Autocomplete
//                         id="combo-box-demo"
//                         options={m.opts.values}
//                         getOptionLabel={(option) => option}
//                         style={{ width: 300 }}
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 className={classes.textField}
//                                 label={m.prop}
//                                 value={m[prop]}
//                                 onChange={m.set}
//                                 disabled={disabled}
//                                 {...otherProps}
//                             />
//                         )}
//                     />
//                 );
//             }
//             case "labels": {
//                 return (
//                     <Autocomplete
//                         multiple
//                         id="size-small-standard-multi"
//                         size="small"
//                         options={m.opts.getAutocompleteItemsSync()}
//                         getOptionLabel={(option) => option}
//                         value={m[prop]}
//                         onChange={m.set}
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 variant="standard"
//                                 className={classes.textField}
//                                 label={m.prop}
//                                 disabled={disabled}
//                                 {...otherProps}
//                             />
//                         )}
//                     />
//                 );
//             }
//             case "link": {
//                 return (
//                     <Autocomplete
//                         multiple
//                         id="size-small-standard-multi"
//                         size="small"
//                         options={m.opts.getAutocompleteItemsSync()}
//                         getOptionLabel={m.opts.getTitle}
//                         value={m[prop]}
//                         onChange={m.set}
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 variant="standard"
//                                 className={classes.textField}
//                                 label={m.prop}
//                                 disabled={disabled}
//                                 {...otherProps}
//                             />
//                         )}
//                     />
//                 );
//             }
//             case "multiLink": {
//                 return (
//                     <Autocomplete
//                         multiple
//                         id="size-small-standard-multi"
//                         size="small"
//                         options={m.opts.getAutocompleteItemsSync()}
//                         getOptionLabel={m.opts.getTitle}
//                         value={m[prop]}
//                         onChange={m.set}
//                         renderInput={(params) => (
//                             <TextField
//                                 {...params}
//                                 variant="standard"
//                                 className={classes.textField}
//                                 label={m.prop}
//                                 disabled={disabled}
//                                 {...otherProps}
//                             />
//                         )}
//                         renderTags={(value, getTagProps) =>
//                             value.map((option, index) => (
//                                 <Chip
//                                     variant="outlined"
//                                     label={m.opts.getTitle}
//                                     size="small"
//                                     {...getTagProps({ index })}
//                                 />
//                             ))
//                         }
//                     />
//                 );
//             }
//             default:
//                 return (
//                     <div>CODE00000004 Unsupported value m.et={(m as any).et || "undefined"}</div>
//                 );
//         }
//     });
// };
//
// if ((module as any).hot) {
//     (module as any).hot.accept();
// }
