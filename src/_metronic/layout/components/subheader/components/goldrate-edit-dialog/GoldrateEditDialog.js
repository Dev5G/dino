import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../../../app/modules/ECommerce/_redux/goldrates/goldratesActions";
import { GoldrateEditDialogHeader } from "./GoldrateEditDialogHeader";
import { GoldrateEditForm } from "./GoldrateEditForm";

const initGoldrate = {
    id: undefined,
    goldrate24k: 0,
    goldrate: 0
};
export function GoldrateEditDialog({ goldrateToday, show, onHide }) {

    // Goldrates Redux state
    const dispatch = useDispatch();
    const { actionsLoading } = useSelector(
        (state) => ({
            actionsLoading: state.goldrates.actionsLoading,
        }),
        shallowEqual
    );

    //useEffect(() => {
    //  // server call for getting Goldrate by id
    //  dispatch(actions.fetchGoldrate(id));
    //}, [id, dispatch]);
    // server request for saving goldrate
    const saveGoldrate = (goldrate) => {
        if (!goldrateToday) {
            // server request for creating goldrate
            dispatch(actions.createGoldrate(goldrate)).then(() => onHide());
        } else {
            // server request for updating goldrate
            dispatch(actions.updateGoldrate(goldrate)).then(() => onHide());
        }
    };

    return (
        <Modal
            size="sm"
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <GoldrateEditDialogHeader id={goldrateToday ? goldrateToday.id : null} />
            <GoldrateEditForm
                saveGoldrate={saveGoldrate}
                actionsLoading={actionsLoading}
                goldrate={goldrateToday || initGoldrate}
                onHide={onHide}
            />
        </Modal>
    );
}
