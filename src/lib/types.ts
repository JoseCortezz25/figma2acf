export enum PluginMessageType {
  EXTRACT_TO_ACF = "extract-to-acf",
  NOTIFY = "notify",
  LOADING = 'loading',
  LOADED = 'loaded',
  NOT_FOUND = "NOT_FOUND",
}


export enum NodeType {
  BOOLEAN_OPERATION = "BOOLEAN_OPERATION",
  CODE_BLOCK = "CODE_BLOCK",
  COMPONENT = "COMPONENT",
  COMPONENT_SET = "COMPONENT_SET",
  CONNECTOR = "CONNECTOR",
  DOCUMENT = "DOCUMENT",
  ELLIPSE = "ELLIPSE",
  EMBED = "EMBED",
  FRAME = "FRAME",
  GROUP = "GROUP",
  INSTANCE = "INSTANCE",
  LINE = "LINE",
  LINK_UNFURL = "LINK_UNFURL",
  MEDIA = "MEDIA",
  PAGE = "PAGE",
  POLYGON = "POLYGON",
  RECTANGLE = "RECTANGLE",
  SHAPE_WITH_TEXT = "SHAPE_WITH_TEXT",
  SLICE = "SLICE",
  STAMP = "STAMP",
  STAR = "STAR",
  STICKY = "STICKY",
  TABLE = "TABLE",
  TABLE_CELL = "TABLE_CELL",
  TEXT = "TEXT",
  VECTOR = "VECTOR",
  WIDGET = "WIDGET"
}

export interface PluginOptions {
  text: string;
};

export interface Payload {
  text?: string;
}
