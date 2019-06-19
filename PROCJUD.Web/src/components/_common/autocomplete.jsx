import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Axios from 'axios';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

const suggestions = [
    { label: 'Afghanistan' },
    { label: 'Aland Islands' },
    { label: 'Albania' },
    { label: 'Algeria' },
    { label: 'American Samoa' },
    { label: 'Andorra' },
    { label: 'Angola' },
    { label: 'Anguilla' },
    { label: 'Antarctica' },
    { label: 'Antigua and Barbuda' },
    { label: 'Argentina' },
    { label: 'Armenia' },
    { label: 'Aruba' },
    { label: 'Australia' },
    { label: 'Austria' },
    { label: 'Azerbaijan' },
    { label: 'Bahamas' },
    { label: 'Bahrain' },
    { label: 'Bangladesh' },
    { label: 'Barbados' },
    { label: 'Belarus' },
    { label: 'Belgium' },
    { label: 'Belize' },
    { label: 'Benin' },
    { label: 'Bermuda' },
    { label: 'Bhutan' },
    { label: 'Bolivia, Plurinational State of' },
    { label: 'Bonaire, Sint Eustatius and Saba' },
    { label: 'Bosnia and Herzegovina' },
    { label: 'Botswana' },
    { label: 'Bouvet Island' },
    { label: 'Brazil' },
    { label: 'British Indian Ocean Territory' },
    { label: 'Brunei Darussalam' }
];

function renderInput(inputProps) {
    const { classes, ref, loading, ...other } = inputProps;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: ref,
                classes: {
                    input: classes.input
                },
                endAdornment: (
                    <InputAdornment position="end">
                        {loading && <CircularProgress size={20} />}
                    </InputAdornment>
                ),
                ...other
            }}
        />
    );
}

const renderSuggestion = (labelProp, complexLabel) => (suggestion, { query, isHighlighted }) => {
    const _suggest =
        typeof complexLabel === 'function' ? complexLabel(suggestion) : suggestion[labelProp];

    const matches = match(_suggest, query);
    const parts = parse(_suggest, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 700 }}>
                            {part.text}
                        </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
};

function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

const getSuggestionValue = (labelProp, complexLabel) => suggestion => {
    return typeof complexLabel === 'function' ? complexLabel(suggestion) : suggestion[labelProp];
};

function getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
              const keep =
                  count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

              if (keep) {
                  count += 1;
              }

              return keep;
          });
}

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        //display: 'inline-block',
        position: 'absolute',
        zIndex: 1,
        //marginTop: theme.spacing.unit,
        left: 0,
        right: 0
    },
    suggestion: {
        display: 'block'
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    }
});

class Autocomplete extends React.Component {
    state = {
        value: '',
        suggestions: [],
        loading: false
    };

    timeout = 0;

    makeRequest = () => {};

    handleSuggestionsFetchRequested = ({ value }) => {
        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.setState({ loading: true });
            Axios.get(this.props.url, { params: { term: value } })
                .then(response => {
                    this.setState({
                        suggestions: eval('response.data.' + this.props.suggestionsProp),
                        loading: false
                    });
                })
                .catch(err => {
                    this.setState({ loading: false });
                    console.log(err);
                });
        }, 400);
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    handleSuggestionSelected = (
        event,
        { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
    ) => {
        if (this.props.clearOnSelect) this.setState({ value: '' });

        //console.log(suggestion);
        //console.log(suggestionValue);

        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(suggestion);
        }
    };

    render() {
        const { classes, placeholder, labelProp, complexLabel, disabled } = this.props;
        const { loading } = this.state;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                onSuggestionSelected={this.handleSuggestionSelected}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue(labelProp, complexLabel)}
                renderSuggestion={renderSuggestion(labelProp, complexLabel)}
                inputProps={{
                    classes,
                    placeholder: placeholder,
                    value: this.state.value,
                    onChange: this.handleChange,
                    loading: loading,
                    disabled: disabled
                }}
            />
        );
    }
}

Autocomplete.defaultProps = {
    placeholder: 'Término a buscar',
    labelProp: 'label',
    clearOnSelect: false,
    url: '',
    suggestionsProp: '',
    complexLabel: null,
    disabled: false
};

Autocomplete.propTypes = {
    classes: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
    labelProp: PropTypes.string,
    clearOnSelect: PropTypes.bool,
    url: PropTypes.string,
    suggestionsProp: PropTypes.string,
    complexLabel: PropTypes.func,
    disabled: PropTypes.bool
};

export default withStyles(styles)(Autocomplete);
