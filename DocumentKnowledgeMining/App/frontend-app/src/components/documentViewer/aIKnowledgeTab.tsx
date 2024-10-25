import { Text } from '@fluentui/react-components';

interface AIKnowledgeTabProps {
    metadata: Record<string, any>;
}

export const AIKnowledgeTab: React.FC<AIKnowledgeTabProps> = ({ metadata }) => {
    return (
        <div>
            {Object.keys(metadata).length > 0 ? (
                Object.entries(metadata).map(([key, values]) => (
                    <div key={key}>
                        <Text weight="bold">{key}:</Text>
                        <ul>
                            {values.map((value: string, index: number) => (
                                <li key={index}>{value}</li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <Text>No AI entities found.</Text>
            )}
        </div>
    );
};
