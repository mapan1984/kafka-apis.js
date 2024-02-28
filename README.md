# kafka tcp api 实现

## 测试运行

    $ node test.js [host] [port] [clientId] [groupId] [topic1] [topic2]...

## 协议实现

参考：

- https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol
- https://kafka.apache.org/protocol.html

### 基础类型

定长基本类型

    int8 | int16 | int32 | int64

字符串：

    String => Size Content
      Size => int16
      Content => Size byte

Byte 序列：

    Bytes => Size Content
      Size => int32
      Content => Size byte

数组：

    Arrays => Length Content
      Length => int32
      Content => [ String | Bytes | int8 | int16 | int32 | int64 ]

### 请求/响应格式

    RequestOrResponse => Size (RequestMessage | ResponseMessage)
      Size => int32

    RequestMessage => ApiKey ApiVersion CorrelationId ClientId Request
      ApiKey => int16
      ApiVersion => int16
      CorrelationId => int32
      ClientId => string
      Request => MetadataRequest | ProduceRequest | FetchRequest | OffsetRequest | OffsetCommitRequest | OffsetFetchRequest

    ResponseMessage => CorrelationId Response
      CorrelationId => int32
      Response => MetadataResponse | ProduceResponse | FetchResponse | OffsetResponse | OffsetCommitResponse | OffsetFetchResponse

#### 元数据请求/响应

    MetadataRequest => [TopicName]
      TopicName => string

    MetadataResponse => [Broker][TopicMetadata]
      Broker => NodeId Host Port  (any number of brokers may be returned)
        NodeId => int32
        Host => string
        Port => int32
      TopicMetadata => TopicErrorCode TopicName [PartitionMetadata]
        TopicErrorCode => int16
      PartitionMetadata => PartitionErrorCode PartitionId Leader Replicas Isr
        PartitionErrorCode => int16
        PartitionId => int32
        Leader => int32
        Replicas => [int32]
        Isr => [int32]

#### 消费组协调者请求/响应

    GroupCoordinatorRequest => GroupId
      GroupId => string

    GroupCoordinatorResponse => ErrorCode CoordinatorId CoordinatorHost CoordinatorPort
      ErrorCode => int16
      CoordinatorId => int32
      CoordinatorHost => string
      CoordinatorPort => int32

#### ApiVersion

    ApiVersions Request =>

    ApiVersions Response => error_code [api_keys]
      error_code => int16
      api_keys => api_key min_version max_version
        api_key => int16
        min_version => int16
        max_version => int16

