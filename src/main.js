import { PyRepoStore } from "@ndn/repo-external";

import { Forwarder } from "@ndn/fw";
import { L3Face } from "@ndn/l3face";
import { enableNfdPrefixReg } from "@ndn/nfdmgmt";
import { UnixTransport } from "@ndn/node-transport";
import { Data, digestSigning, Name } from "@ndn/packet";

async function main() {
  const repoPrefix = process.env.DEMO_PYREPO_PREFIX;
  if (!repoPrefix) {
    console.log(`
    To run @ndn/repo-external demo, set the following environment variables:
    DEMO_PYREPO_PREFIX= command prefix of ndn-python-repo
    `);
    process.exit(0);
  }
  const dataPrefix = new Name(`/NDNts-repo-external/${Math.trunc(Math.random() * 1e8)}`);

  const face = await UnixTransport.createFace({}, process.env.DEMO_NFD_UNIX ?? "/run/nfd.sock");
  enableNfdPrefixReg(face);

  const store = new PyRepoStore({
    repoPrefix: new Name(repoPrefix),
  });

  const packets = [];
  for (let i = 0; i < 256; ++i) {
    const data = new Data(dataPrefix.append(`${i}`));
    data.freshnessPeriod = 1;
    await digestSigning.sign(data);
    packets.push(data);
  }

  console.log(`Inserting ${packets.length} packets under ${dataPrefix} to ${repoPrefix}`);
  try {
    await store.insert(...packets);
  } finally {
    await store.close();
    face.close();
  }
}