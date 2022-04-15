import { Text, Box, Heading } from '@chakra-ui/react';
import * as styles from './styles';

interface CustomErrorProps {
    title: string;
    message?: string;
  }

export const NFTCustomError = ({ title, message }: CustomErrorProps) => {
  return (
    <Box>
      <Heading {...styles.TitleStyle} mb={'20px'}>
        {title}
      </Heading>
      <Text fontSize={'14px'} mx={'auto'} maxW={'260px'} textAlign={'center'}>
        {message}
      </Text>
    </Box>
  );
};
