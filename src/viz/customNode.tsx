import { ComponentType, useState } from "react";

import { Handle, NodeProps, Position } from "reactflow";
import { AlertTriangle, InfoCircle } from "tabler-icons-react";

import { ActionIcon, Group, Modal, Stack, Text, Tooltip } from "@mantine/core";

import { LemmaState } from "../structure/types";
import { useFlowContext } from "./contexts";

export const CustomNode: ComponentType<NodeProps> = ({
  data,
}: NodeProps<LemmaState>) => {
  const { invalidate, validate } = useFlowContext();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Stack>
      {/* Node Menu. */}
      <Group gap="xs" className="nodrag">
        {/* Info */}
        <Tooltip label="Info">
          <ActionIcon
            variant="default"
            color="blue"
            onClick={() => setInfoOpen(true)}
          >
            <InfoCircle size={16} />
          </ActionIcon>
        </Tooltip>

        {/* Validation */}
        <Tooltip label={data.valid ? "Invalidate" : "Validate"}>
          <ActionIcon
            variant={data.valid ? "default" : "filled"}
            color="red"
            onClick={() =>
              data.valid ? invalidate(data.id) : validate(data.id)
            }
          >
            <AlertTriangle size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Node content. */}

      <Text
        size="md"
        // style={{
        //   overflow: "hidden",
        //   textOverflow: "ellipsis",
        //   display: "-webkit-box",
        //   WebkitLineClamp: 3,
        //   WebkitBoxOrient: "vertical",
        // }}
      >
        {data.encoding}
      </Text>

      {/* Node handles. */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id="a" />

      <Modal
        opened={infoOpen}
        withCloseButton={false}
        onClose={() => setInfoOpen(false)}
        centered
      >
        <p>
          <strong>Encoding:</strong> {data.encoding}
        </p>
        <p>
          <strong>Valid:</strong> {data.valid ? "Yes" : "No"}
        </p>
        <p>
          <strong>Dependencies:</strong> {data.dependencies.length}
        </p>
      </Modal>
    </Stack>
  );
};
