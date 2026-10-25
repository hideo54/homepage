interface BlockDevice {
    model?: string;
    removable: string;
    rev?: string;
    size: string;
    state?: string;
    timeout?: string;
    vendor?: string;
}

interface CPU {
    cache_size?: string;
    core_id?: string;
    cores?: string;
    family?: string;
    mhz: string | number;
    model: string | number;
    model_name: string;
    physical_id?: string;
    stepping?: string;
    vendor_id: string;
}

interface FileSystem {
    fs_type?: string;
    kb_available: number;
    kb_size: number;
    kb_used: number;
    label?: string;
    mount: string;
    percent_used: string;
    volume_name?: string;
}

interface Kernel {
    machine: string;
    name: string;
    os: string;
    platform_name: string;
    platform_version: string;
    release: string;
    version: string;
}

interface Memory {
    active?: string;
    anon_pages?: string;
    bounce?: string;
    buffers?: string;
    cached?: string;
    commit_limit?: string;
    committed_as?: string;
    dirty?: string;
    free: string;
    inactive?: string;
    mapped?: string;
    nfs_unstable?: string;
    page_tables?: string;
    slab?: string;
    slab_reclaimable?: string;
    slab_unreclaim?: string;
    swap_cached?: string;
    swap_free?: string;
    swap_total?: string;
    total: string;
    vmalloc_chunk?: string;
    vmalloc_total?: string;
    vmalloc_used?: string;
    writeback?: string;
}

interface HostMeta {
    'agent-revision': string;
    'agent-version': string;
    'agent-name': string;
    block_device: { [key: string]: BlockDevice };
    cpu: CPU[];
    filesystem: { [key: string]: FileSystem };
    kernel: Kernel;
    memory: Memory;
    cloud?: {
        provider: 'gce';
        metadata: {
            hostname: string;
            'instance-id': string;
            'instance-type': string;
            projectId: string;
            zone: string;
        };
    };
}

interface Host {
    name: string;
    displayName: string | null;
    customIdentifier: string;
    meta: HostMeta;
    size: string;
    status: string; // working
    memo: string;
    isRetired: boolean;
    id: string;
    createdAt: number;
    roles: { [key: string]: string[] };
    interfaces: {
        macAddress: string;
        name: string;
        ipv4Addresses: string[];
        ipv6Addresses: string[];
        ipAddress: string;
        ipv6Address: string;
    }[];
}
