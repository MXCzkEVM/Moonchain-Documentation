---
sidebar_position: 12
---

# Moonchain ZK Lite Paper



## Block diagram

![Staking_BlockDiagram](./Staking_BlockDiagram.png)

### APP

A mobile application for participants (end users).

### Proxy Service

A back-end service responsible for miner registration. It also analyses miner status and forwards the results to the staking contract.

### mxc-prover-service

A back-end service includes the prover manager and the Taiko-client-prover. It is responsible for SGX proof generation for miners, miner registration, and miner data analysis for penalty issuance.

### sgx-prover

A service running on the miner that retrieves jobs from the back end, generates SGX proofs, and submits them back.

### Staking Contract

An L1 contract on the Arbitrum chain that manages the entire staking process.



## Staking

A participant needs one miner (SGX prover) and a certain amount of MXC staked in the Moonchain L1 staking contract. After the staking period, the participant can claim a reward. This staking transaction must be performed using their own wallet, which also serves as their identity.

**[!!Request for Comment:]** A participant using two or more miners with a single wallet will not affect the reward. The advantage of having additional miners is that they can act as backups—if one miner goes down, the others can continue operating, preventing penalties.



## Staking Period

A staking period, known as an epoch, lasts for seven days and aligns with every Thursday at 00:00 UTC. Rewards are calculated based on the number of epochs the amount has been staked.

![Staking_Epoch](./Staking_Epoch.png)



## Penalty

When the miner reach either one of the following condition, a penalty will apply to the participant.

- The online time is not reach 85% for a staking period.

- Failed for 3 consequence SGX generation job.

  **[!! To be change]** As observed, the raiko will failed for unknown reason and keep in a unknown state. Need further study to prevent this first before applying this fro penalty.



## Reward

Rewards are calculated based on a 10% APR applied to the total staked amount of MXC. They are then distributed according to each participant's staking weight and total pledge duration (in number of epoch).



## Participating

Here’s an example workflow for participating in staking:

1. Purchase a miner.
2. Use the APP to create a wallet.
3. Connect to the miner via Bluetooth using the app.
4. Retrieve the SGX instance ID and save the wallet address to the miner.
5. Call the API on the Proxy Service to register the miner with the wallet address and SGX instance ID.
6. Interact with the L1 Staking Contract to stake an amount of MXC.

After staking, periodically call the L1 Staking Contract to claim rewards.



## Staking Contract

Mainnet Address: TBD

Testnet Address: TBD



#### function stake(address _user, uint256 _amount)

Deposits MXC token to be used as bonds.

_user: The user address to credit.

_amount: The amount of token to deposit.



#### function stakingRequestWithdrawal(bool cancel)

Request a withdrawal. It will start the lock period.

cancel: Set to true for cancelling any previous request.



#### function stakingWithdrawal() 

User completes the withdrawal after the lock period.



#### function stakingClaimReward()

User claims their accumulated interest and transfers it to their wallet.



## Prover Service (back-end server) APIs for APP

Mainnet base URL: https://prover-manager.moonchain.com/

Testnet base URL: https://geneva-prover-manager.moonchain.com/



#### POST `/app/registerMiner1`

This is the first step of the miner registration. Call this with the created wallet address to start the process. A `agentToken` will return. The APP must send the wallet address and `agentToken` to the miner, then the miner will use this information to verify itself with the Prover Service.

Example POST data:

```
{
  "instanceId": 0,
  "walletAddress": "0x0123456789ABCDEF0123456789ABCDEF01234567"
}
```

Example response:

```
{
  "ret": 0,
  "message": "",
  "result": {
    "agentToken": "VZ/NkCa4I0WCzO9SW9HCx6fzgOYLpyXMC/uTqxG+qFA="
  }
}
```



#### POST `/app/registerMiner2`

This is the second step of the registration. After the miner verify itself with the `agentToken` got from step 1, this step will be success and returned a `appToken`. The `appToken` will be used to query the miner status later on.

Example POST data:

```
{
  "instanceId": 0
}
```

Example response (miner not verify yet):

```
{
  "ret": 0,
  "message": "Wait for miner.",
  "result": {
    "appToken": "",
	"waitForMiner": true
  }
}
```

Example response (miner verified):

```
{
  "ret": 0,
  "message": "",
  "result": {
    "appToken": "K6P1QE7Az6Qh8JmPFjgR1XhG9bbzWviO1zKMhWN2FyU",
	"waitForMiner": false  
  }
}
```



#### POST `/app/minerStatus/<INSTANCE_ID>`

Get the status of a miner.

Example response:

```
{
  "ret": 0,
  "message": "",
  "result": {
    "online": true,
    "lastSeen": "2018-12-10T13:45:00.000Z",
    ...
  }
}
```



## Miner Registration Flow

```mermaid
sequenceDiagram
  loop Not registered
    Miner->>+ProverService: ping
    ProverService-->>-Miner: Auth failed
  end
  Note over APP,Miner: Start of registration
  APP->>+ProverService: registerMiner1
  ProverService-->>-APP: agentToken
  APP->>+Miner: Save walletAddress and agentToken
  Miner-->>-APP: success
  Miner->>Miner: Restart agent service
  Miner->>+ProverService: ping with correct agentToken
  ProverService-->>-Miner: success
  APP->>+ProverService: registerMiner2
  ProverService-->>-APP: appToken
  Note over APP,Miner: End of registration
  opt APP operations
    APP->>+ProverService: minerStatus
    ProverService-->>-APP: status  
  end 
  loop Registered
    Miner->>+ProverService: fetch/submit proof jobs
    ProverService-->>-Miner: success
  end 
```

