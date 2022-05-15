import { ListItem, ListItemButton } from '@mui/material';
import { HTMLAttributes } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

export default function AutocompleteListBox(props: HTMLAttributes<HTMLElement>) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;

  return (
    <div {...other} role={role}>
      <FixedSizeList
        itemCount={itemCount}
        height={280}
        width="100%"
        itemSize={60}
        itemData={children}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}

function renderRow(props: ListChildComponentProps) {
  const { index, style, data } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>{data[index]}</ListItemButton>
    </ListItem>
  );
}
