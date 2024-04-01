import { useState } from 'react';
import { SerializedEntity } from '@/renderer/viewer/ecs/Entity';
import { EntityListItem } from './EntityListItem';

type EntityListParentProps = {
  selectEntity: (id: number) => void;
  index: number;
  entity: SerializedEntity;
  level: number;
  currentlySelected: number | null;
};

function get_entity_type(entity: SerializedEntity): 'mesh' | 'light' | 'blank' {
  const meshComp = entity.components.filter((c) => c[0] === 'Mesh')[0];
  const lightComp = entity.components.filter((c) => c[0] === 'Light')[0];
  if (meshComp) return 'mesh';
  if (lightComp) return 'light';
  return 'blank';
}

export function EntityListParent(props: EntityListParentProps) {
  const { entity, index, selectEntity, level, currentlySelected } = props;
  const name = entity.components.filter(
    (comp) => comp[0] === 'Name',
  )?.[0]?.[1] as string;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <li>
      <EntityListItem
        selected={currentlySelected !== null && currentlySelected === entity.id}
        tabIndex={index}
        onCollapse={() => {
          setCollapsed(!collapsed);
        }}
        onSelect={() => selectEntity(entity.id)}
        type={get_entity_type(entity)}
        name={name}
        level={level}
        collapsible={entity.children.length > 0}
        collapsed={collapsed}
      />
      <ul>
        {!collapsed && (
          <ul>
            {entity?.children.map((child, i) => {
              return (
                <EntityListParent
                  key={`${child.id}-child`}
                  entity={child}
                  index={index + i}
                  selectEntity={props.selectEntity}
                  level={props.level + 1}
                  currentlySelected={currentlySelected}
                />
              );
            })}
          </ul>
        )}
      </ul>
    </li>
  );
}
