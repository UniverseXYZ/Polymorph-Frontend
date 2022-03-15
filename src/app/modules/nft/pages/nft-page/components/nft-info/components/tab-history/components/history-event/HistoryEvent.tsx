import { Box, Flex, Text, Link, Image, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react'
import { NFTTabItemWrapper } from '../../..';
import { useAuthContext } from '../../../../../../../../../../../contexts/AuthContext';
import { getEtherscanTxUrl } from '../../../../../../../../../../../utils/helpers';
import { shortenEthereumAddress } from '../../../../../../../../../../../utils/helpers/format';
import { getTokenByAddress, TOKENS_MAP, ZERO_ADDRESS } from '../../../../../../../../../../constants';
import { TokenTicker } from '../../../../../../../../../../enums';
import { useTokenPrice } from '../../../../../../../../../../hooks';
import { IToken } from '../../../../../../../../../../types';
import { IERC20AssetType, IERC721AssetType, IOrder } from '../../../../../../../../types';
import { HistoryType } from '../../../../../../enums';
import { actionIcon, nameLabels } from '../../constants';
import { getAddedAtLabel } from '../../helpers';
import * as styles from "../../styles";
import EtherScanIcon from './../../../../../../../../../../../assets/images/etherscan.svg';

interface IHistoryEventProps {
  event: IOrder;
}

const HistoryEvent:React.FC<IHistoryEventProps> = ({event}) => {
  const { web3Provider } = useAuthContext() as any;
  const [blockDate, setBlockDate] = useState(new Date());

  let type: HistoryType = HistoryType.MINTED;
  let price = "";
  let token: IToken = null as any;
  
  if (event.from !== ZERO_ADDRESS) {
    const side = event.side;
    const status = event.status;
    type = (side === 1 && status === 2) ? HistoryType.BOUGHT : (side === 1 && status === 0) ? HistoryType.LISTED : HistoryType.OFFER;
    
    if (side === 0) {
      token = getTokenByAddress((event.make.assetType as IERC721AssetType).contract);
      const tokenDecimals = TOKENS_MAP[token.ticker]?.decimals ?? 18;
      
      price = new BigNumber(utils.formatUnits(event.make.value, tokenDecimals)).toFixed(2);
    } else {
      token = getTokenByAddress((event.take.assetType as IERC20AssetType).contract);
      const tokenDecimals = token?.decimals ?? 18;
      
      price = new BigNumber(utils.formatUnits(event.take.value, tokenDecimals)).toFixed(2);
    }
  }

  const usdPrice = useTokenPrice(token?.ticker);

  const usd = new BigNumber(price).multipliedBy(usdPrice).toFixed(2);

  const endDate = new Date(event.end * 1000);
  const expired = type === HistoryType.OFFER ? dayjs().diff(endDate) > 0 : false;

  const getBlockTimestamp = async () => {
    const blockTimestamp = await web3Provider?.getBlock(event?.blockNum);
    setBlockDate(new Date(blockTimestamp?.timestamp * 1000));
  }
  
  useEffect(() => {
    getBlockTimestamp();
  }, [web3Provider, event])

  return (
    <NFTTabItemWrapper>
      <Flex>
        <Box {...styles.ActionIconStyle} bg={actionIcon[type]} />
        <Box>
          <Text {...styles.NameStyle}>
            <Box {...styles.ActionLabelStyle}>{nameLabels[type]} </Box>{ event.makerData && (event.makerData.displayName ? event.makerData.displayName : shortenEthereumAddress(event.makerData.address)) }
          </Text>
          <Text {...styles.AddedLabelStyle}>
            {getAddedAtLabel(type === HistoryType.MINTED ? blockDate : event.createdAt)}
            {expired && <Box as={'span'} {...styles.ExpiredStyle}> (expired)</Box>}
          </Text>
        </Box>
      </Flex>
      <Flex alignItems={'center'}>
        {!!price && <Box textAlign={'right'}>
          <Text {...styles.PriceStyle}>{price} {token?.ticker ?? ""}</Text>
          <Text {...styles.PriceUSDStyle}>${usd}</Text>
        </Box>}
        {(type === HistoryType.BOUGHT || type === HistoryType.MINTED) && event.matchedTxHash &&
          <Link href={getEtherscanTxUrl(event.matchedTxHash)} target={'_blank'} ml={'16px'}>
            <Tooltip hasArrow variant={'black'} {...styles.EtherscanTooltipStyle}>
              <Image src={EtherScanIcon} {...styles.EtherscanIconStyle} />
            </Tooltip>
          </Link>
        }
      </Flex>
    </NFTTabItemWrapper>
  );
}

export default HistoryEvent