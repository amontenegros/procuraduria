import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
        marginTop: -2
    },
    button: {
        margin: theme.spacing.unit
    }
});

const ConsultaActionButtons = ({
    classes,
    onClickReporte,
    showBtnNuevoProceso,
    anchorEl,
    onOpenCloseMenuReporte,
    showBtnReporteExcel
}) => (
    <div>
        {showBtnReporteExcel && (
            <Button
                color="primary"
                className={classes.button}
                onClick={onOpenCloseMenuReporte(true)}
            >
                <Icon className={classes.leftIcon}>bar_chart</Icon>
                Reporte Excel
            </Button>
        )}
        {showBtnNuevoProceso && (
            <Button
                color="primary"
                className={classes.button}
                component={Link}
                {...{ to: "/nuevo-proceso" }}
            >
                <AddIcon className={classes.leftIcon} />
                Nuevo Proceso
            </Button>
        )}
        {showBtnReporteExcel && (
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onOpenCloseMenuReporte(false)}
            >
                <MenuItem onClick={onClickReporte(1)}>Exportar Consulta</MenuItem>
                {/* <MenuItem onClick={onClickReporte(2)}>Reporte 2</MenuItem>
            <MenuItem onClick={onClickReporte(3)}>Reporte 3</MenuItem> */}
            </Menu>
        )}
    </div>
);

export default withStyles(styles)(ConsultaActionButtons);
